#!/bin/sh

# jboss-slot-manager.sh [get-free-slot , get-all-free-slots , get-all-slots-used-and-free]
# get-free-slot --> returns the next available JBoss slot (or false)
# get-all-free-slots --> returns a comma seperated list of all free slots
# get-all-slots-used-and-free --> returns a comma seperated list of all existing slots (used and free)

JBINSTANCES=/app/middleware/jboss-eap-instances-created-by-jon/
INSTTEMPLATE="usrjbs[0-9][0-9]"

# get-free-slot
if [ x$1 = "xget-free-slot" ]; then
  AVAIL=
  for d in $( find $JBINSTANCES -mindepth 1 -maxdepth 1 -type d -name "$INSTTEMPLATE" | sort ); do
	if [ ! -h $d -a ! -d $d/.rhqdeployments ] ; then
		AVAIL=$(basename $d)
		break
	fi
  done
  if [ "$AVAIL" ]; then
	echo $AVAIL
  else
    echo "no-slot-available-on-machine"
  fi
  exit 0
fi

# get-all-free-slots
if [ x$1 = "xget-all-free-slots" ]; then
  AVAIL=
  for d in $( find $JBINSTANCES -mindepth 1 -maxdepth 1 -type d -name "$INSTTEMPLATE" | sort ); do
        if [ ! -h $d -a ! -d $d/.rhqdeployments ] ; then
                AVAIL=$AVAIL,$(basename $d)
        fi
  done
  if [ "$AVAIL" ]; then
        echo $AVAIL | sed -e 's/^,//'
  else
        echo "no-slot-available-on-machine"
  fi
  exit 0
fi

# get-all-slots-used-and-free
if [ x$1 = "xget-all-slots-used-and-free" ]; then
  AVAIL=
  for d in $( find $JBINSTANCES -mindepth 1 -maxdepth 1 -type d -name "$INSTTEMPLATE" | sort ); do
                AVAIL=$AVAIL,$(basename $d)
  done
  if [ "$AVAIL" ]; then
        echo $AVAIL | sed -e 's/^,//' 
  else
        echo "Not any slot available on this machine. Please contact your sys admin."
  fi
  exit 0
fi

echo "[USAGE]: ./jboss-slot-manager.sh [get-free-slot , get-all-free-slots , get-all-slots-used-and-free]"
echo " - example 1 :  './jboss-slot-manager.sh get-free-slot' returns 'usrjbs01'"
echo " - example 2 :  './jboss-slot-manager.sh get-all-free-slots' returns 'usrjbs01,usjbs02'"
echo " - example 3 :  './jboss-slot-manager.sh get-all-slots-used-and-free' returns 'usrjbs01,usrjbs02,usrjbs03,usrjbs04'"
exit 1
